
const toast = function (text, timeout, z, el) {
    this.text = text;
    this.timeout = timeout || '';
    this.z = z || 999;
    this.el = el || document.body;
    this.init();
}

window.toast = toast;
toast.prototype.init = function () {
    var Html =
        `<div class="toast-mask">
       <div class="toast">
       ${this.text} 
       </div>
       </div>`
    this.node = document.createElement("div");
    this.html=Html
    this.node.innerHTML = this.html;

    this.el.appendChild(this.node);

    document.querySelector('.toast-mask').ontouchmove = function () {
        event.preventDefault();
    }

    if (this.timeout && this.timeout > 0) {
        setTimeout(() => {
            this.el.removeChild(this.node);

        }, this.timeout)
    }

};
toast.prototype.hide=function(){
    this.el.removeChild(this.node);
}

export default {
    toast
}
