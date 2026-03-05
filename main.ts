let _r = 10
let _on = false
let _ran = false
let _ms = 5000

function detectMobs() {
    let mobs = ["zombie", "skeleton", "creeper", "spider",
        "enderman", "witch", "drowned", "husk", "stray",
        "phantom", "pillager", "vindicator", "blaze", "ghast"]
    for (let i = 0; i < mobs.length; i++) {
        player.execute(
            "execute @e[type=" + mobs[i] + ",r=" + _r + "] ~ ~ ~ say found " + mobs[i]
        )
    }
}

player.onChat("guard", function () {
    _r = 10
    _on = true
    if (!_ran) {
        _ran = true
        loops.forever(function () {
            if (_on) {
                detectMobs()
            }
            loops.pause(_ms)
        })
    }
})

player.onChat("stop", function () {
    _on = false
})
