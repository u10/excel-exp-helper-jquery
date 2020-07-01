import './css/index.css'

import * as $ from 'jquery'
import 'tooltipster'
import 'tooltipster/dist/css/tooltipster.bundle.css'
import 'tooltipster/dist/css/plugins/tooltipster/sideTip/themes/tooltipster-sideTip-punk.min.css'
import 'tooltipster/dist/css/plugins/tooltipster/sideTip/themes/tooltipster-sideTip-light.min.css'
import { formatCode } from './libs/formatter'
import 'jquery.splitter'
import 'jquery.splitter/css/jquery.splitter.css'
import * as CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/vbscript/vbscript.js'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/anyword-hint.js'
import keywords from './libs/keywords'

let src = ''

$(function() {
  const $help = $('#help')
  const $result = $('#result')

  const editor = CodeMirror.fromTextArea(document.getElementById('source') as any, {
    lineNumbers: true,
    mode: 'vbscript',
    extraKeys: {"Ctrl": "autocomplete"},
    hintOptions: {
      hint: handleShowHint,
      completeSingle: false
    }
  } as any);

  function handleShowHint() {
    const cur = editor.getCursor();
    const curLine = editor.getLine(cur.line);
    const start = cur.ch;

    let list: string[] = []
    let curWord = ''
    let index = start
    while (/\w/.test(curLine.charAt(index-1))) {
      curWord = curLine.charAt(--index) + curWord
    }

    if (curWord) {
      let uniCurWord = curWord.toLocaleUpperCase()
      list = keywords.filter(keyword => {
        return keyword.toLocaleUpperCase().startsWith(uniCurWord)
      })

      if (list.length == 1 && list[0]==curWord) {
        list = []
      }
    }

    return {
      list,
      from: CodeMirror.Pos(cur.line, start - curWord.length),
      to: CodeMirror.Pos(cur.line, start)
    };
  }

  editor.setSize('auto','95vh');

  var splitter = ($('#container').height('100vh') as any).split({
    orientation: 'vertical',
    limit: 10,
    position: '50%', // if there is no percentage it interpret it as pixels
    onDrag: function(event: any) {
        console.log(splitter.position());
    }
  });

  $('#format').on('click', function() {
    editor.setValue(formatCode(editor.getValue() as string, false))
  })

  editor.on('change', function() {
    (editor as any).showHint()
    $result.html(formatCode(editor.getValue()))
    $('.keyword').tooltipster({
      interactive: true,
      theme: 'tooltipster-punk',
      trigger: 'hover',
      side: ['left', 'top', 'right', 'bottom'],
      maxWidth: 800,
      distance: 2,
      contentAsHTML: true,
      functionPosition: function (instance, helper, position) {
        if (position.coord.top < 8) {
          position.size.height = position.size.height - 8 + position.coord.top
          position.coord.top = 8
        }
        if (position.coord.left < 8) {
          position.size.width = position.size.width - 8 + position.coord.left
          position.coord.left = 8
        }
        return position
      },
      functionBefore: function(instance, helper) {
        var key
        if ($('.tooltipster-show').length > 0) {
          return false
        }
        key = $(helper.origin).text()
        instance.content($help.find("[name='" + key + "']").parents('p').html() + ("<br><br><a href='ExcelFuncManual.html#" + key + "' target='_blank' style='color: red'>[查看]</a> ") + ("<a href='https://baidu.com/s?wd=excel 函数 " + key + "' target='_blank' style='color: red'>[百度]</a><br>"))
        return true
      }
    })

    $('.folder').on('click', function(event: Event) {
      var $el, isFold
      $el = $(event.target)
      isFold = !$el.hasClass('unfold')
      if (isFold) {
        $el.addClass('unfold')
        $el.tooltipster({
          interactive: true,
          theme: 'tooltipster-light',
          trigger: 'hover',
          side: ['top', 'right', 'bottom', 'left'],
          contentAsHTML: true,
          content: "<pre class='fold-tooltip'>" + ($(($el[0] as any).nextSibling).html()) + "</pre>",
          functionPosition: function(instance, helper, position) {
            if (position.coord.top < 8) {
              position.size.height = position.size.height - 8 + position.coord.top
              position.coord.top = 8
            }
            if (position.coord.left < 8) {
              position.size.width = position.size.width - 8 + position.coord.left
              position.coord.left = 8
            }
            return position
          }
        })
      } else {
        $el.removeClass('unfold')
        $el.tooltipster('destroy')
      }
      ($el[0] as any).nextSibling.style.display = isFold ? 'none' : 'inline'
    })
  })

  editor.setValue(src)
})
