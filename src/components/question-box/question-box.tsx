import {useChatQuestionStore} from "../../stores/chat-question-store.js";

const {question, addQuestion, askQuestion} = useChatQuestionStore();

function questionBox() {

    return (
        <div class='w-full flexitems-center flex flex-col'>
                <textarea class="textarea textarea-ghost w-3xl min-h-0.5 resize-none focus:outline-hidden"
                          placeholder="询问任何问题"
                          value={question()}
                          onInput={e => addQuestion(e.target.value)}/>
            <span class="badge badge-neutral badge-2xs">
                    <label class="swap">
                        {
                            !question() ?
                                <div>o.O</div> :
                                <button onClick={askQuestion}>发送</button>
                        }
                    </label>
                </span>
        </div>
    )
}

export default questionBox
