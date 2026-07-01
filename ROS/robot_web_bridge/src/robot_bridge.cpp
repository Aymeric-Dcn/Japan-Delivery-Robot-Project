#include <memory>
#include <string>

#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/string.hpp"

using std::placeholders::_1;

class RobotBridge : public rclcpp::Node
{
public:
    RobotBridge()
    : Node("robot_bridge")
    {
        mission_subscriber_ =
            this->create_subscription<std_msgs::msg::String>(
                "/mission",
                10,
                std::bind(&RobotBridge::missionCallback, this, _1));

        status_publisher_ =
            this->create_publisher<std_msgs::msg::String>(
                "/robot_status",
                10);

        RCLCPP_INFO(this->get_logger(), "Robot bridge started");
    }

private:

    void missionCallback(const std_msgs::msg::String::SharedPtr msg)
    {
        RCLCPP_INFO(
            this->get_logger(),
            "Mission received: %s",
            msg->data.c_str());

        publishStatus("Mission received");

        rclcpp::sleep_for(std::chrono::seconds(1));

        publishStatus("Robot started");

        rclcpp::sleep_for(std::chrono::seconds(2));

        publishStatus("Robot moving");

        rclcpp::sleep_for(std::chrono::seconds(3));

        publishStatus("Robot arrived");
    }

    void publishStatus(const std::string & status)
    {
        auto message = std_msgs::msg::String();

        message.data = status;

        status_publisher_->publish(message);

        RCLCPP_INFO(
            this->get_logger(),
            "Status: %s",
            status.c_str());
    }

    rclcpp::Subscription<std_msgs::msg::String>::SharedPtr mission_subscriber_;

    rclcpp::Publisher<std_msgs::msg::String>::SharedPtr status_publisher_;
};

int main(int argc, char * argv[])
{
    rclcpp::init(argc, argv);

    rclcpp::spin(std::make_shared<RobotBridge>());

    rclcpp::shutdown();

    return 0;
}