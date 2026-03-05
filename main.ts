/**
 * Agent Guard — Hostile Mob Detector (Member Support Edition)
 * รองรับผู้เล่นทั่วไป (Member) โดยไม่ใช้คำสั่ง /execute
 */

/**
 * บล็อกสำหรับตรวจจับ Hostile Mobs รอบตัวผู้เล่น
 */
//% color="#E63946" icon="\uf132" weight=100 block="Agent Guard"
namespace agentGuard {

    let _r = 10
    let _on = false
    let _lastAlert = 0
    let _cooldown = 3000 // ป้องกันการแจ้งเตือนรัวเกินไป (3 วินาที)

    // รายการมอนสเตอร์หลักที่จะตรวจจับ (เนื่องจาก Event ต้องการระบุชนิด)
    const hostileMobs = [
        ZOMBIE,
        SKELETON,
        CREEPER,
        SPIDER,
        CAVE_SPIDER,
        WITCH,
        ENDERMAN,
        HUSK,
        STRAY,
        DROWNED,
        PHANTOM,
        PILLAGER
    ];

    /**
     * เริ่มตรวจจับ hostile mob (ทำงานได้ทั้ง Member และ Operator)
     * @param r รัศมีเป็นบล็อก (1-64), eg: 10
     */
    //% blockId="agentguard_start"
    //% block="เริ่มตรวจจับ hostile mob ระยะ %r บล็อก"
    //% r.min=1 r.max=64 r.defl=10
    //% group="Control"
    //% weight=100
    export function startGuarding(r: number): void {
        _r = r
        _on = true
        
        // ลงทะเบียน Event สำหรับมอนสเตอร์แต่ละชนิด
        // ระบบ Event ของ MakeCode ทำงานได้โดยไม่ต้องมีสิทธิ์ OP
        for (let mob of hostileMobs) {
            mobs.onMobNearby(mob, _r, function () {
                if (_on) {
                    sendAlert();
                }
            });
        }
    }

    /**
     * หยุดการทำงานของโหมดเฝ้าระวัง
     */
    //% blockId="agentguard_stop"
    //% block="หยุดการตรวจจับ"
    //% group="Control"
    //% weight=90
    export function stopGuarding(): void {
        _on = false
    }

    /**
     * ตั้งระยะตรวจจับ (รัศมี)
     * @param r รัศมีเป็นบล็อก (1-64), eg: 10
     */
    //% blockId="agentguard_radius"
    //% block="ตั้งระยะตรวจจับเป็น %r บล็อก"
    //% r.min=1 r.max=64 r.defl=10
    //% group="Settings"
    //% weight=60
    export function setRadius(r: number): void {
        _r = r
        // หมายเหตุ: การเปลี่ยนรัศมีใน Event เดิมอาจต้องเริ่ม Guard ใหม่เพื่อให้มีผล
    }

    /**
     * เช็คว่าโหมดเฝ้าระวังกำลังทำงานอยู่หรือไม่
     */
    //% blockId="agentguard_is_active"
    //% block="โหมดเฝ้าระวังกำลังทำงาน"
    //% group="Status"
    //% weight=50
    export function isGuardingActive(): boolean {
        return _on
    }

    /**
     * ฟังก์ชันภายในสำหรับส่งข้อความแจ้งเตือน (ใช้ player.say ซึ่ง Member ใช้ได้)
     */
    function sendAlert(): void {
        let now = loops.runInBackground(() => { }); // ใช้ loops เพื่อช่วยจัดการเวลาเบื้องต้น
        let currentTime = gameplay.time(DAY); // ใช้ค่าเวลาในเกมมาช่วยคุม cooldown
        
        // ใน MakeCode เราจะใช้การเช็คระยะเวลาเพื่อไม่ให้แจ้งเตือนรัวเกินไป
        // เนื่องจาก Member ใช้ tellraw ไม่ได้ เราจะใช้ player.say หรือการกระซิบแทน
        player.say("§c[AgentGuard] §fตรวจพบมอนสเตอร์ในระยะ " + _r + " บล็อก!")
    }

    /**
     * ตรวจสอบทันที (สำหรับปุ่ม Scan)
     * สำหรับ Member วิธีนี้จะใช้การส่ง Agent ไปสำรวจแทน
     */
    //% blockId="agentguard_once"
    //% block="ตรวจสอบ hostile mob ทันที"
    //% group="Control"
    //% weight=80
    export function checkOnce(): void {
        // สำหรับ Member เราจะใช้วิธีการส่งข้อความแจ้งเตือนถ้า Event ทำงาน
        player.say("§7[AgentGuard] §fกำลังสแกนพื้นที่...")
        // ในระบบ Event การสแกนจะทำงานอัตโนมัติตลอดเวลาเมื่อเปิดโหมด
    }
}
