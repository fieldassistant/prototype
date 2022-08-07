
import { h } from 'preact';
import { Link } from 'react-router-dom';
import { useRef } from 'preact/hooks';
import { DateTime } from 'luxon';
import { useGetEntries } from './Entry';
import { useGetFields } from './Configuration';
import { CSVBuilder } from './CSVBuilder';
import { useInput } from './useInput';
import { css } from './css';
import { useBackPath } from './Header';

declare global {
    interface WebShare {
        files?: File[];
        url?: string;
        text?: string;
        title?: string;
    }
}


export function ExportView() {
    
    useBackPath("/");
    
    const entries = useGetEntries();
    const fields = useGetFields();
    
    const ref = useRef<HTMLAnchorElement | null>(null);
    const [filename, onFilename] = useInput(() => (
        DateTime.local().toFormat("yyyy-MM-dd_HH-mm")
    ))
    
    async function onSend() {
        if (!navigator.share || !navigator.canShare) return;
        
        const builder = buildCSV();
        
        const data: WebShare = {
            files: [ builder.buildFile(filename) ],
            title: filename + ".csv",
        };
        
        try {
            if (navigator.canShare(data)) {
                await navigator.share(data)
            }
        }
        catch (error: any) {
            console.log(error, error.message);
        }
    }
    
    function onSave() {
        if (!ref.current) return;
        
        const builder = buildCSV();
        const [url, download] = builder.buildFileUrl(filename);
        
        ref.current.href = url;
        ref.current.download = download;
        ref.current.click();
        
    }
    
    function buildCSV() {
        const builder = new CSVBuilder();
        
        builder.addHeaders(
            "Voucher",
            "Date",
            "Time",
            "Latitude",
            "Longitude",
            "Elevation (m)",
            "Collector",
        );
        
        if (fields) {
            for (let field of fields) {
                builder.addHeaders(field.name);
            }
        }
        
        for (let entry of entries) {
            const date = DateTime.fromMillis(entry.entry_id);
            const data = fields?.map(field => entry.data[field.name]);
            
            builder.add(
                entry.voucher,
                date.toLocaleString(DateTime.DATE_SHORT),
                date.toLocaleString(DateTime.TIME_24_SIMPLE),
                entry.position.latitude,
                entry.position.longitude,
                entry.position.elevation,
                entry.collector || "",
                ...(data || []),
            );
        }
        
        return builder;
    }
    
    return (
        <div>
            <a ref={ref} style={{display: 'none'}} />
            
            <div className="text-title">
                Exporting {entries.length} entries.
            </div>
            
            <div className="form">
                <div className="form-field">
                    <label>File name</label>
                    <input
                        type="text"
                        name="filename"
                        value={filename}
                        onChange={onFilename}
                        required
                    />
                </div>
            </div>
            <br/>
            <div className="navbar">
                <button type="button"
                    className={css("button", {highlight: !navigator.share})}
                    onClick={onSave}
                    disabled={entries.length == 0}>
                    Save
                </button>
                <button type="button"
                    className="button highlight"
                    onClick={onSend}
                    disabled={entries.length == 0 || !navigator.share}>
                    Send
                </button>
            </div>
            
        </div>
    )
}