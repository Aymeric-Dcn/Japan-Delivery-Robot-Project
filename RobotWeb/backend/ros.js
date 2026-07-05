const rclnodejs = require("rclnodejs");

let missionPublisher = null;
let unlockPublisher = null;

async function initROS(onStatusReceived) {

    await rclnodejs.init();

    const node = new rclnodejs.Node("web_bridge");

    // ==========================
    // Publishers
    // ==========================

    missionPublisher = node.createPublisher(
        "std_msgs/msg/String",
        "/mission"
    );

    unlockPublisher = node.createPublisher(
        "std_msgs/msg/Bool",
        "/unlock"
    );

    // ==========================
    // Subscribers
    // ==========================

    node.createSubscription(
        "std_msgs/msg/String",
        "/robot_status",
        (msg) => {

            console.log("[ROS] Status:", msg.data);

            if (onStatusReceived) {
                onStatusReceived(msg.data);
            }

        }
    );

    rclnodejs.spin(node);

    console.log("ROS bridge started");
}


// ==========================
// Publish Mission
// ==========================

function publishMission(mission) {

    if (!missionPublisher) {

        console.log("ROS mission publisher not initialized");

        return;
    }

    const json = JSON.stringify(mission);

    missionPublisher.publish({

        data: json

    });

    console.log("[ROS] Mission published:", json);

}


// ==========================
// Publish Unlock
// ==========================

function publishUnlock(unlock = true) {

    if (!unlockPublisher) {

        console.log("ROS unlock publisher not initialized");

        return;
    }

    unlockPublisher.publish({

        data: unlock

    });

    console.log("[ROS] Unlock published:", unlock);

}


module.exports = {

    initROS,

    publishMission,

    publishUnlock

};