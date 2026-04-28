import sys
import numpy as np

def main():
    if len(sys.argv) > 1:
        numbers = [float(x) for x in sys.argv[1:]]
        avg = np.mean(numbers)
        print(f"Average: {avg}")
    else:
        print("Average: 0")

if __name__ == "__main__":
    main()
