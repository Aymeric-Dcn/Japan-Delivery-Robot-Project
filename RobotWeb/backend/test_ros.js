const rclnodejs = require("rclnodejs");

async function main() {

    await rclnodejs.init();

    const node = new rclnodejs.Node("test_node");

    node.createSubscription(
        "std_msgs/msg/String",
        "/robot_status",
        (msg) => {

            console.log("Status:", msg.data);

        }
    );

    rclnodejs.spin(node);
}

main();