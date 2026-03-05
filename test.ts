// tests go here; this will not be compiled when this package is used as an extension
player.onChat("guard", function () {
    agentGuard.startGuarding(10)
})
player.onChat("stop", function () {
    agentGuard.stopGuarding()
})
player.onChat("scan", function () {
    agentGuard.checkOnce()
})
