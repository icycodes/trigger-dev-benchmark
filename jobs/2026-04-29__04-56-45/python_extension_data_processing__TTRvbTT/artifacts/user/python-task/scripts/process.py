#!/usr/bin/env python3
import sys
import numpy as np

# Read numbers from command-line arguments
numbers = [float(arg) for arg in sys.argv[1:]]

# Calculate the average using numpy
average = np.mean(numbers)

# Print the result in the specified format
print(f"Average: {average}")