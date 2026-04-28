import sys
import numpy as np

def main():
    numbers = [float(arg) for arg in sys.argv[1:]]
    average = np.mean(numbers)
    print(f"Average: {average}")

if __name__ == "__main__":
    main()
