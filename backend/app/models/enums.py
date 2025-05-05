import enum

class TransitEnum(str, enum.Enum):
    arrival = "arrival"
    departure = "departure"