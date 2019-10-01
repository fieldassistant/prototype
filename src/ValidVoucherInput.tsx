
import { h } from 'preact';
import { useRef } from 'preact/hooks';
import { useGetEntries } from './entry';

type Props = h.JSX.HTMLAttributes & {
    autoCapitalize?: string;
}

export function ValidVoucherInput(props: Props) {
    const ref = useRef<HTMLInputElement | null>(null);
    const entries = useGetEntries();
    
    function onChange(event: Event) {
        if (ref.current) {
            const found = entries.find(entry => (
                entry.voucher.toLowerCase() === ref.current!.value.toLowerCase())
            );
            if (found) {
                ref.current.setCustomValidity(`"${found.voucher}" already exists.`);
            }
        }
        
        // Forward.
        props.onChange && props.onChange(event);
    }
    
    return (
        <input
            {...props}
            onChange={onChange}
            ref={ref}
        />
    )
}