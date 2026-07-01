cmake_minimum_required(VERSION 3.8)
project(robot_web_bridge)

find_package(ament_cmake REQUIRED)
find_package(rclcpp REQUIRED)
find_package(std_msgs REQUIRED)

add_executable(robot_bridge src/robot_bridge.cpp)

ament_target_dependencies(
  robot_bridge
  rclcpp
  std_msgs
)

install(
  TARGETS robot_bridge
  DESTINATION lib/${PROJECT_NAME}
)

ament_package()