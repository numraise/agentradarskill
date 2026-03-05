/**
 * Agent Guard — Hostile Mob Detector
 * For Minecraft Education Edition 1.21.x
 * ใช้ OLD execute syntax ของ Bedrock/Education Edition
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
    export function startGuarding(r: number): void {
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
    export function stopGuarding(): void {
        _on = false
    }

    //% blockId="agentguard_once"
    //% block="ตรวจสอบ hostile mob ทันที"
    //% group="Control"
    //% weight=80
    export function checkOnce(): void {
        detectMobs()
    }

    //% blockId="agentguard_freq"
    //% block="ตรวจสอบทุก %sec วินาที"
    //% sec.min=1 sec.max=60 sec.defl=5
    //% group="Settings"
    //% weight=70
    export function setFrequency(sec: number): void {
        _ms = sec * 1000
    }

    //% blockId="agentguard_radius"
    //% block="ตั้งระยะตรวจจับ %r บล็อก"
    //% r.min=1 r.max=64 r.defl=10
    //% group="Settings"
    //% weight=60
    export function setRadius(r: number): void {
        _r = r
    }

    function detectMobs(): void {
        let mobs = [
            "zombie", "skeleton", "creeper", "spider", "cave_spider",
            "enderman", "witch", "drowned", "husk", "stray",
            "phantom", "pillager", "vindicator", "ravager",
            "evoker", "vex", "blaze", "ghast", "magma_cube",
            "slime", "elder_guardian", "guardian", "shulker",
            "warden", "bogged", "breeze"
        ]
        for (let i = 0; i < mobs.length; i++) {
            player.execute(
                `execute @e[type=${mobs[i]},r=${_r}] ~ ~ ~ tell @p [Agent Guard] Found ${mobs[i]} nearby!`
            )
        }
    }
}
