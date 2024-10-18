import '@/styles/index.scss';

document.addEventListener('DOMContentLoaded', function () {
    const material = Object.freeze(<Record<number, string>>{
        0: '量子之海出现了异常观测现象，博识学会评估，可能另一世界产生的崩坏能超过阈值，并极有可能溢出从而影响到其它世界。',
        1: '为了防止天使坠落，维斯达利斯通知学园都市立即召回所有对抗崩环能的第三批实验仿生对象。',
        2: '我的上级也立即召我回国，为第二十九次秩序大战做准备。',
        3: '尽管上级也支持我携带 PangBai 一同回归，但近些天来，我发觉 PangBai 突然变得沉默寡言，夜晚身体也发出微弱的光，若隐若现。事态的紧急使我已经无法顾及。',
        4: '长期以来的经验令我敏锐地感觉到，PangBai 或将成为这次崩坏能溢出引发的一系列事件中的主角。',
        5: '但我仍对与她的告别——也许是短暂的，抑或是永远，谁能预料呢——持乐观态度，毕竟没有人阻止这类事的发生，除非同谐能瞥见虚数之树下的她的掠影。',
        6: '只是这周结束后，不知多久才能与曾经的梦魇重逢。',
    });

    const selectarea = document.querySelector('.select-area')!;
    let cont = document.querySelector('.area')!;
    let textspan = document.getElementById('text')!;
    const attachEvent = () => cont.classList.add('event')
    const detachEvent = () => cont.classList.remove('event')
    const setAutoWidth = () => {
        cont.classList.add('justify');
        textspan.style.width = ''
        textspan.style.height = ''
    }
    const setFitWidth = (html: string) => {
        textspan.style.opacity = '0';
        setAutoWidth();
        cont.classList.add('justify');
        textspan.innerHTML = html;
        let width = textspan.offsetWidth;
        let height = textspan.offsetHeight;
        textspan.style.width = width + 'px';
        textspan.style.height = height + 'px';
        textspan.innerHTML = '';
        textspan.style.opacity = '1';
    }
    const setText = (html: string) => {
        textspan.innerHTML = html;
    }
    const getHtmlText = (html: string) => {
        const sp = document.createElement('span');
        sp.innerHTML = html;
        return sp.innerText;
    }
    let on_animate = false;
    let interval_array: number[] = [];
    const clearAllInterval = () => { while (interval_array.length) clearInterval(interval_array.pop()); }
    const animateText = (html: string, cb: CallableFunction | null = () => { }) => {
        on_animate = true;
        clearAllInterval();
        setFitWidth(html);
        let appended = '';
        let pos = 0;
        let cnt = 0;
        let fulltext = getHtmlText(html);
        let interval = setInterval(() => {
            let c = html[pos];
            if (c === '<') {
                let end = pos;
                while (html[end] !== '>') end++;
                c = html.substring(pos, end + 1);
                pos = end;
            }
            appended += c;
            setText(appended);
            pos++;
            cnt++;
            if (cnt > 0 && cnt >= fulltext.length * 0.75) {
                on_animate = false;
            }
            if (pos >= html.length) {
                clearAllInterval();
                on_animate = false;
                if (typeof cb === 'function') cb();
            }
        }, 50)
        interval_array.push(interval);
    }
    const after_animate = () => {
        setTimeout(() => {
            selectarea.classList.replace('prevent', 'active');
        }, 1000)
    }
    let next_material = 0, TOT_MATERIAL = Object.keys(material).length;

    cont.addEventListener('click', function () {
        if (next_material >= TOT_MATERIAL) return;
        if (on_animate) return;
        animateText(material[next_material], next_material === TOT_MATERIAL - 1 ? after_animate : null);
        next_material++;
        if (next_material >= TOT_MATERIAL) {
            detachEvent();
        }
    })
})
