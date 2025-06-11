import {createSignal} from 'solid-js'

function App() {
    const [test, setTest] = createSignal("")

    return (
        <>
            <p>{test()}</p>
            <div class="card">
                <button onClick={() => setTest(() => "帅 solid 帅")}>
                    click me
                </button>
            </div>
        </>
    )
}

export default App
