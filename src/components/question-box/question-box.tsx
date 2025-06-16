import {useChatQuestionStore} from "../../stores/chat-question-store.js";
import type {Component} from "solid-js";

const {question, addQuestion, askQuestion, inside} = useChatQuestionStore();

const QuestionBox: Component = () => {
    return (
        <div class='w-full flexitems-center flex flex-col shadow-sm p-2 rounded-md m-4 bg-white border-1 border-[#e5e5e5] border-solid'>
            <textarea class="text-lg textarea textarea-ghost w-4xl min-h-min resize-none focus:outline-hidden p-1"
                      rows={1}
                      placeholder="询问任何问题"
                      value={question()}
                      onInput={e => addQuestion(e.target.value)}/>
            <span class="shadow-sm p-1 badge badge-soft badge-primary badge-lg rounded-sm m-1">
                {
                    inside() ?
                        <span class="loading loading-dots loading-sm"></span> :
                        !question() ?
                            <div>o.O</div> :
                            <button onClick={askQuestion}>发送</button>
                }
            </span>
        </div>
    )
}

export default QuestionBox
