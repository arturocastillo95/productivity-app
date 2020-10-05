import {BASE_URL} from './../App'


Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

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
    const url = BASE_URL + 'api/task-update/' + obj.id + '/'

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

export const createTask = async (obj, csrf_token) => {
    const url = BASE_URL + 'api/task-create/';

    try {
        const create = await fetch(url, {
            'method': 'POST',
            'headers' : {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
            },
            'body': JSON.stringify(obj)
        });
    } catch (error) {
        console.log(error)
    }
};

// Sample task function
export async function createSampleTasks() {
    var dates = dataHeaders();
    var dLen = dates.length;
    var tasks = [];
    var csrf_token = getCookie('csrftoken');
    var i;

    for (i = 0; i < 50; i++) {
        //Random date in the last week
        var duration = Math.floor(Math.random() * (7200 - 1800 + 1)) + 1800;
        var elapsed = Math.floor(Math.random() * duration);
        var random_boolean = Math.random() >= 0.5;

        var obj = {'title': 'Sample Task ' + i, 'duration': duration, 'remaining': elapsed};

        if (random_boolean) {
            var rnd = Math.floor(Math.random() * dLen);
            obj['completed'] = true;
            obj['finish_date'] = dates[rnd]
        };

        tasks.push(obj);
    }
    
    const create_tasks = await tasks.forEach(t => {
        createTask(t, csrf_token);
    });

    return create_tasks;

}