
import { h } from 'preact';
import { Link } from 'react-router-dom';
import { ConfigBlock } from './ConfigBlock';
import { useBackPath } from './Header';

import { TEMPLATES } from './templates';

export function TemplatesView() {
    
    useBackPath("/settings");
    
    return (
        <div>
            <div className="text-title">
                Templates
            </div>
            <div className="">
                {TEMPLATES.map((config, i) => (
                    <ConfigBlock
                        key={i}
                        index={i + 1}
                        config={config}
                    />
                ))}
            </div>
            <div>
                <br/>
                If you have a set of fields you always use, feel free to send
                them through and they can be included here.
                <br/>
                <a href="mailto:hello@fieldassistant.app">
                    hello@fieldassistant.app
                </a>
            </div>
        </div>
    )
}
