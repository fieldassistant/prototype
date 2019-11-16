
import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import { useDispatch } from 'react-redux';
import { useParams, Redirect } from 'react-router';
import { DispatchFn } from './store';
import { useGetFields, ConfigField, Configuration } from './Configuration';
import { Link } from 'react-router-dom';
import { FieldBlock } from './FieldBlock';

import { TEMPLATES } from './templates';

const EMPTY_FIELDS: ConfigField[] = [{
    name: "",
    type: "string",
}]

export function ConfigNewView() {
    return (
        <ConfigFormView
            back_path="/settings"
            fields={EMPTY_FIELDS}
        />
    )
}

export function ConfigEditView() {
    const fields = useGetFields();
    
    if (!fields) {
        return <Redirect to="/config/new" />
    }
    
    return (
        <ConfigFormView
            back_path="/settings"
            fields={fields}
        />
    )
}

type Params = {
    index: string;
}

export function TemplateEditView() {
    const { index } = useParams<Params>();
    const config = TEMPLATES[+index - 1];
    
    return (
        <ConfigFormView
            back_path="/templates"
            fields={config.fields}
            config={config}
        />
    )
}


type Props = {
    back_path: string;
    fields: ConfigField[];
    config?: Configuration;
}

function ConfigFormView(props: Props) {
    const [fields, setFields] = useState(props.fields);
    const [redirect, setRedirect] = useState("");
    const dispatch = useDispatch<DispatchFn>();
    
    function addField() {
        setFields([ ...fields, {
            name: "",
            type: "string",
        }]);
    }
    
    function updateField(index: number, field: ConfigField) {
        const copy = [ ...fields ];
        copy.splice(index, 1, field);
        setFields(copy);
    }
    
    function removeField(index: number) {
        const copy = [ ...fields ];
        copy.splice(index, 1);
        setFields(copy);
    }
    
    function onSubmit(event: Event) {
        event.preventDefault();
        dispatch({ type: "CONFIG", fields });
        setRedirect("/");
    }
    
    if (redirect) {
        return <Redirect to={redirect} />
    }
    
    return (
        <form onSubmit={onSubmit}>
            {props.config ? (
            <Fragment>
                <div className="text-message">
                    Applying template: {props.config.name}
                </div>
                <div>
                    {props.config.description}
                    <br/>
                    By {props.config.contributor}.
                </div>
                <br/>
            </Fragment>
            ) : (
            <div className="text-message">
                Edit Fields
            </div>
            )}
            <div className="form">
                {fields.map((field, index) => (
                    <FieldBlock
                        key={index}
                        index={index}
                        field={field}
                        onUpdate={updateField}
                        onRemove={removeField}
                    />
                ))}
                {fields.length == 0 && (
                    <span>No fields.</span>
                )}
            </div>
            <nav className="navbar">
                <Link to={props.back_path}
                    className="button">
                    Back
                </Link>
                <button type="button"
                    className="button highlight"
                    onClick={addField}>
                    Add Field
                </button>
                <button type="submit"
                    className="button highlight">
                    Save
                </button>
            </nav>
        </form>
    )
}
