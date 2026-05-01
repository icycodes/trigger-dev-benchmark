import sys
import numpy as np


def main() -> None:
    numbers = [float(value) for value in sys.argv[1:]]
    if not numbers:
        raise ValueError("At least one number is required")

    average = np.mean(numbers)
    print(f"Average: {average}")


if __name__ == "__main__":
    main()
