import type {Component} from "solid-js";

const sidebar: Component = () => {
    return (
        <ul class="menu bg-base-200 rounded-box w-56">
            <li><a>问题 1</a></li>
            <li><a>问题 2</a></li>
            <li><a>问题 3</a></li>
        </ul>
    )
}

export default sidebar
