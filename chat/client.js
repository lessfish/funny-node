let config = {
  name: '', // nickname
}

// 与 server.js 启动地址对应
var socket = io.connect('http://localhost:8080')

// 监听服务端发出的 newMessage 事件
socket.on('newMessage', (data) => generateMsgItem(data))

socket.on('showOnlineNumber', (onlineNumber) => {
  $('#onlineNumber').text(`匿名聊天室（当前在线 ${onlineNumber} 人）`)
})

// 发送信息
$('#msgBtn').click(() => {
  let name = config.name
  let msg = document.querySelector('#msgIpt').value
  sendMessage({ name, msg })
  $('#msgIpt').val('')
})

// 当输入文字时，取消 has-error 样式
$('#nameIpt').on('focus', () => {
  $('#myModal').removeClass('has-error')
})

// 点击保存昵称
$('#nameBtn').click(() => {
  let name = $('#nameIpt').val().trim()

  if (name === '') {
    $('#myModal').addClass('has-error')
    $('#helpBlock').show()
  } else {
    config.name = name
    $('#myModal').modal('hide')
    socket.emit('finishNickname')
  }
})

// 发送信息以及昵称保存都可以按 enter 键
document.onkeydown = (e) => {
  if (e.keyCode !== 13) return

  let id = e.target.id

  // 发送消息
  if (id === 'msgIpt') {
    let name = config.name,
      msg = document.querySelector('#msgIpt').value

    sendMessage({ name, msg })
    $('#msgIpt').val('')
  } else if (id === 'nameIpt') {
    // 保存昵称
    let name = $('#nameIpt').val().trim()

    if (name === '') {
    } else {
      config.name = name
      $('#myModal').modal('hide') // 隐藏遮罩层
      socket.emit('finishNickname')
    }
  }
}

function sendMessage(data) {
  // 发送消息
  socket.emit('sendMsg', data)
  generateMsgItem(data, true)
}

function generateMsgItem(data, isRight = false) {
  let item = document.createElement('div')
  item.className = 'item' + (isRight ? ' text-right' : '')

  if (isRight)
    item.innerHTML = `<span class="content">${data.msg}</span><span class="name">【${data.name}】</span>`
  else
    item.innerHTML = `<span class="name">【${data.name}】</span><span class="content">${data.msg}</span>`

  document.querySelector('.chat-area').appendChild(item)

  // 如果聊天区域的内容高度大于了 DOM 高度，则自动 scroll 到最底下
  let realHeight = document.querySelector('.chat-area').scrollHeight
  let viewHeight = $('.chat-area').height()
  $('.chat-area').scrollTop(realHeight - viewHeight)
}

// 页面初始化时显示 modal
$('#myModal').modal({ show: 'show', backdrop: 'static' })
