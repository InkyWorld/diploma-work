import enum

class TransitEnum(str, enum.Enum):
    arrival = "arrival"
    departure = "departure"

class ShiftEnum(str, enum.Enum):
    day = "day"
    night = "night"