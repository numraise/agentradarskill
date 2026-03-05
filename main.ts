/**
 * Agent Guard — Hostile Mob Detector
 * Minecraft Education Edition 1.21.x
 */

//% color="#E63946"
namespace agentGuard {

    let _r = 10
    let _on = false
    let _ran = false
    let _ms = 5000

    //% blockId="agentguard_start"
    //% block="เริ่มตรวจจับ hostile mob ระยะ %r บล็อก"
    //% r.min=1 r.max=64 r.defl=10
    //% group="Control"
    //% weight=100
    export function startGuarding(r: number) {
        _r = r
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
    }

    //% blockId="agentguard_stop"
    //% block="หยุดการตรวจจับ"
    //% group="Control"
    //% weight=90
    export function stopGuarding() {
        _on = false
    }

    //% blockId="agentguard_once"
    //% block="ตรวจสอบ hostile mob ทันที"
    //% group="Control"
    //% weight=80
    export function checkOnce() {
        detectMobs()
    }

    //% blockId="agentguard_freq"
    //% block="ตรวจสอบทุก %sec วินาที"
    //% sec.min=1 sec.max=60 sec.defl=5
    //% group="Settings"
    //% weight=70
    export function setFrequency(sec: number) {
        _ms = sec * 1000
    }

    //% blockId="agentguard_radius"
    //% block="ตั้งระยะตรวจจับ %r บล็อก"
    //% r.min=1 r.max=64 r.defl=10
    //% group="Settings"
    //% weight=60
    export function setRadius(r: number) {
        _r = r
    }

    function detectMobs() {
        let mobs = ["zombie", "skeleton", "creeper", "spider",
            "enderman", "witch", "drowned", "husk", "stray",
            "phantom", "pillager", "vindicator", "ravager",
            "evoker", "vex", "blaze", "ghast", "magma_cube",
            "slime", "elder_guardian", "guardian", "shulker",
            "warden", "bogged", "breeze", "cave_spider"]
        for (let i = 0; i < mobs.length; i++) {
            let mob = mobs[i]
            let msg = "execute as @a at @s if entity @e[type=" + mob + ",r=" + _r + "] run tell @s [Agent Guard] Found " + mob + " within " + _r + " blocks!"
            gameplay.executeCommand(msg)
        }
    }
}
