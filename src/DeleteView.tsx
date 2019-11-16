
import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useParams, Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetEntry } from './Entry';
import { DispatchFn } from './store';
import { sleep } from './useGeo';

type Params = {
    entry_id: string;
}

export function DeleteView() {
    const { entry_id } = useParams<Params>();
    const entry = useGetEntry(entry_id);
    const dispatch = useDispatch<DispatchFn>();
    const [redirect, setRedirect] = useState("");
    
    async function onRemove() {
        dispatch({
            type: "REMOVE",
            entry_id: parseInt(entry_id) || 0,
        });
        await sleep(100);
        setRedirect("/")
    }
    
    if (redirect) return <Redirect to={redirect} />
    
    if (!entry) return <Redirect to="/" />
    
    return (
        <div>
            <div className="text-message">
                Deleting entry: {entry.voucher}
                <br/>
                Are you sure?
            </div>
            <div className="navbar">
                <button type="button"
                    className="button highlight"
                    onClick={onRemove}>
                    Yes, delete it
                </button>
                <Link to="/"
                    className="button">
                    Wait no!
                </Link>
            </div>
        </div>
    )
}
