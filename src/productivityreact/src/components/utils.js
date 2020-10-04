export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export function fancyTimeFormat(duration)
{   
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export function dateToStr(date) {
    var dd = String(date.getDate()).padStart(2,'0');
    var mm = String(date.getMonth() + 1).padStart(2,'0');
    var year = date.getFullYear();

    var today = year + '-' + mm + '-' + dd;
    return today;
}

export function dataHeaders() {
    var today = new Date();
    var arr = [today];
    var i;
    for (i = -1; i > -8; i--) {
        var current = today;
        arr.unshift(current.addDays(i));
    };
    var headers = arr.map(d => dateToStr(d))
    return headers;
}

export const taskUpdate = async (obj, csrf_token) => {
    const url = 'http://127.0.0.1:8000/api/task-update/' + obj.id + '/'

    try {
        const update = await fetch(url, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
            },
            'body': JSON.stringify(obj)
        })
    } catch (error) {
        console.log(error)
    }
}

