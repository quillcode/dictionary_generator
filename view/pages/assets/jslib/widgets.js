// this script is to controle dialogs and should be imported after vuejs
const widgets = {};
widgets.confirm = (() => {
    const dw = document.createElement('div');
    dw.setAttribute('id', 'dialog_wrapper');
    const select = (el) => dw.querySelector(el);
    const body = document.querySelector('body');
    body.appendChild(dw);
    dw.innerHTML = `<div class="confirm">
                    <p class="msg">Message</p>
                    <div class="btn-wrapper">
                        <button class="confirm-btn">YES</button>
                        <button class="cancel-btn">CANCEL</button>
                    </div>
                </div>`
    const cf_btn = select('.confirm .confirm-btn');
    const cn_btn = select('.confirm .cancel-btn');
    // callback
    let cb;
    dw.addEventListener('click', (event) => {
        // cancel
        if (event.target == dw) {
            dw.classList.remove('show');
            cb(false);
        }
    });
    cn_btn.addEventListener('click', (event) => {
        // cancel
        event.stopPropagation();
        dw.classList.remove('show');
        cb(false);
    });
    cf_btn.addEventListener('click', (event) => {
        // confirm
        event.stopPropagation();
        dw.classList.remove('show');
        cb(true);
    });

    return function (message, type, callback) {
        cb = callback
        cf_btn.classList.add(type);
        select('.confirm .msg').innerHTML = message;
        dw.classList.add('show');
        // make cancel the default button
        cn_btn.focus();
    }
})();

widgets.notify = (() => {

    const root = document.createElement('div');
    root.setAttribute('id', 'widgets');
    const body = document.querySelector('body');


    function createNotification() {
        const notification = document.createElement('div');
        notification.setAttribute('class', 'notification');

        const close = document.createElement('i');
        close.innerHTML = 'close';
        close.setAttribute('class', 'material-icons close');

        // add children to notification
        notification.append(close);
        root.appendChild(notification);

        close.addEventListener('click', (event) => {
            // confirm
            notification.classList.remove('show');
    
        });

        return notification;
    }

    body.appendChild(root);

    return function (message, type) {
        let n = createNotification();
        n.classList.add(type);
        n.classList.add('show');

        const msg = document.createElement('span');
        msg.setAttribute('class', 'msg');
        msg.innerText = message;
        n.append(msg);

        setTimeout(()=>{
            n.classList.remove('show');
        }, 5000)
    }
})();