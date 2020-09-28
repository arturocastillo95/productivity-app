import React from 'react'

export default function Todo({ todo }) {
    return (
        <div className="box">
            <input type="checkbox"/>
            <span>{ todo.name }</span>
        </div>
    )
}
