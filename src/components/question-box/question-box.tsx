import {useChatQuestionStore} from "../../stores/chat-question-store.js";
import type {Component} from "solid-js";

const {question, addQuestion, askQuestion, inside} = useChatQuestionStore();

const QuestionBox: Component = () => {
    return (
        <div class='w-full flexitems-center flex flex-col shadow-lg p-2 rounded-md m-4 bg-base-200 border-solid'>
            <textarea
                class="text-lg textarea textarea-ghost w-2xl min-h-min resize-none focus:outline-hidden p-1 focus:bg-base-200"
                rows={1}
                placeholder="询问任何问题"
                value={question()}
                onInput={e => addQuestion(e.target.value)}/>
            <div class={`transition-transform duration-300 w-min ${inside() || question() ? "translate-x-[650px]" : "translate-x-0]"}`}>
                <span class="shadow-md p-1 badge badge-soft badge-lg rounded-lg m-1 border-[#bdbdbd]">
                    {
                        inside() ?
                            <span class="loading loading-dots loading-sm"></span> :
                            !question() ?
                                <IconMdiLockQuestion/> :
                                <IconMdiSend onClick={askQuestion}/>
                    }
                </span>
            </div>
        </div>
    )
}

export default QuestionBox
