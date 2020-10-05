import React from 'react'

export function DurationSelector({ setTaskDuration }) {
    return (
        <div className="field pb-3">
        <label className="label">Task duration</label>
        <div className="control has-icons-left">
            <div className="select">
                <select onChange={e => setTaskDuration(e.target.value)} defaultValue={'Short (30 min)'}> 

                <option>
                    Short (30 min)
                </option>
                <option>
                    Medium (1 hr)
                </option>
                <option>
                    Long (2 hrs)
                </option>
                {/* <option>
                    Custom (Max. 2hrs)
                </option> */}

                </select>
            </div>
            <div className="icon is-small is-left">
                <i className="fas fa-stopwatch"></i>
            </div>
        </div>
    </div>
    )
}
