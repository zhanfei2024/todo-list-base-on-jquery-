; (function () {
  'use strict';
  let task_list = [];
  let $del = null;
  let $detail = null;
  let $entry = null;
  let $form = null;
  let $checkbox = null;
  init();

  $('form').on('submit', function (e) {
    let new_task = {};
    let $input = $('form').children('input[name="content"]');
    /* 阻止浏览器默认行为 */
    e.preventDefault();
    /* 获取新task的值 */
    new_task.content = $input.val();
    /* 如果新task值为空，程序终止 */
    if (!new_task.content) return;
    /* 如果新task值不为空，调用addtask函数，添加一条信息 */
    if (addTask(new_task)) {
      render_task_list();
      $input.val(null);
    }
  });

  function listion_task_delet() {
    $del.on('click', function () {
      let index = $(this).parent().index();
      confirm('你确定要删除') ? delTask(index) : null;
      init();
    })
  }
  function listion_task_detail() {
    $detail.on('click', function () {
      let index = $(this).parent().index();
      callBackShow(index);
    });
    $entry.on('dblclick', function () {
      let index = $(this).index();
      callBackShow(index);
    });

    function callBackShow(index) {
      $('.detailWarpper').show();
      $('.mask').show();
      render_task_updata(index);
    }

    $('.mask').on('click', function () {
      $('.detailWarpper').hide();
      $(this).hide();
    });
  }

  function listion_task_updata() {
    $form.find('p').on('dblclick', function () {
      $('.newTitle').show();
      $(this).hide();
    });
    $form.find('textarea').focus(function() {
      $(this).val('');
    })
    $form.find('.newTitle').focus(function() {
      $(this).val('');
    })
    $form.one('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();
      let current_index = $(this).attr('data-index');
      let current_obj = {};
      current_obj.content = $('.newTitle').val();
      current_obj.detailMsg = $(this).find('textarea').val();
      current_obj.dateTime = $(this).find('input.date').val();
      task_list[current_index] = current_obj;
      store.set('task_list', task_list);
     console.log(store.get('task_list'));
     init();
    });
  }

  function listen_task_complete() {
    $checkbox.on('click', function() {
      let complete = $(this).is(':checked');
      let current_index = $(this).parent().index();
      let current_obj = task_list[current_index];
      current_obj.checked = complete;
      store.set('task_list', task_list);
      // render_task_list()
      // init();
    })
  }
  function render_task_updata(index) {
    let detailMsg = `<form data-index=${index}>
      <p class="title">${task_list[index].content}</p>
      <input type="text" class="newTitle" value=${task_list[index].content}>
      <textarea class="input" autofocus="true" name="detaiLMsg"></textarea>
      <input class="input date" type="date" name="date">
      <input class="updata" type="submit" value="更新">
    </form>`;
    let $detail = $(detailMsg);
    let $detailWarpper = $('.detailWarpper');
    $detailWarpper.empty();
    $detailWarpper.append($detail);
    $('.input[type="date"]').val(task_list[index].dateTime);
    $('textarea').val(task_list[index].detailMsg || '输入你要做的事情的详细计划');
    $form = $('.detailWarpper').find('form');
    listion_task_updata();
  }

  function init() {
    task_list = store.get('task_list') || [];
    if (task_list.length) render_task_list();
  }

  function addTask(new_task) {
    task_list.push(new_task);
    store.set('task_list', task_list);
    return true;
  }


  function delTask(current_index) {
    task_list.splice(current_index, 1);
    store.set('task_list', task_list);
  }

  function render_task_list() {
    let $content = $('#content');
    $content.empty();

    for (var i = 0; i < sort_task_list(task_list).length; i++) {
      let task = render_task_item(sort_task_list(task_list)[i])
      $('#content').append(task);
    }
    $del = $('.del');
    $detail = $('.dta');
    $entry = $('.entry');
    $checkbox = $('input[type="checkbox"]');
    listion_task_delet();
    listion_task_detail();
    listen_task_complete();
  }

  function sort_task_list(arr) {
    let retNormal = [];
    let retBoolean = [];
    for(var i = 0; i < arr.length; i++) {
      if (arr[i].complete) {
        retBoolean.push(arr[i])
      } else {
        retNormal.push(arr[i])
      }
    };
    return  retNormal.concat(retBoolean);
  }

  function render_task_item(data) {
    let list_item_tpl = `<div class="entry">
          <input type="checkbox" checked=${data.complete}>
          <span>${data.content}</span>
          <span class="button del">删除</span>
          <span class="button dta">详细</span>
        </div>`;
    return $(list_item_tpl);
  }

})();