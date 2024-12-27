import sys
sys.setrecursionlimit(10000000)

def add(x,y):
    if x ==0:
        return y
    elif x >0:
        return add(x - 1, y) + 1
    else:
        return add(x + 1, y) - 1
def worst_add(x, y):
    result = y;
    n = 10000;
    for r in range(n):
        if x > r:
            result = add(result, 1)
        else:
            result = add(result, -1)
    return add(add(result,n),-x)
def recursive_worst_add(x, y, depth):
    if depth <= 0:
        return worst_add(x, y)
    else:
        return recursive_worst_add(x, y, depth - 1)
def reverse_string(text):
    return text[::-1]
def obfuscate_number(num):
    num_str =str(num)
    num_str= reverse_string(num_str)
    num_str = num_str.replace('1', '9')
    num_str= reverse_string(num_str)
    return int(num_str)
def introduce_noise(num):
    return num + 42
def calculate_result(num1, num2):
    num1_obfuscated = obfuscate_number(num1)
    num2_obfuscated = obfuscate_number(num2)
    result =recursive_worst_add(num1_obfuscated, num2_obfuscated, 20)
    result =introduce_noise(result)
    return result
num1= int(input("Enter the first number: "))
num2= int(input("Enter the second number: "))
print("Calculating .........")
import time
#time.sleep(60)
result = calculate_result(num1, num2)
print(f"The sum of {num1} and {num2} is {result}")
print("Good job waiting")
