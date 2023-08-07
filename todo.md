- iPhone reports screen.orientation.angle with the opposite sign from the standard
  * Made a StackOverflow thread, but haven't found a good answer
  * May need to do a hardware survey, since apparently no one else has
- In landscape mode on iPhone, touch-look rotation is inverted
  * iPhone reports screen.orientation.angle opposite to the standard. Have a StackOverflow thread but no good answers yet
- Maybe touch-look rotation shouldn't require a touch, it should just 'look' by default and a touch can freeze the rotation?
- Throttle is not very discoverable
- Also, no good way to handle throttle during screen orientation changes, since the throttle area gets covered by the top or bottom UI panels
