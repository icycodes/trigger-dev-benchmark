import sys

import numpy as np


def main() -> None:
    values = [float(value) for value in sys.argv[1:]]
    average = float(np.mean(values))
    print(f"Average: {average}")


if __name__ == "__main__":
    main()
