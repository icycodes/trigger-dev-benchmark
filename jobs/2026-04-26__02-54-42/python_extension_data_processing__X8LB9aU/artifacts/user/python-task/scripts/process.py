import sys
import numpy as np


def main() -> None:
    args = sys.argv[1:]
    if not args:
        print("Average: 0")
        return

    numbers = [float(value) for value in args]
    average = float(np.mean(numbers))
    print(f"Average: {average}")


if __name__ == "__main__":
    main()
