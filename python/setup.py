import setuptools

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setuptools.setup(
    name="pyhpp",
    version="0.0.4",
    author="Kun-Neng Hung",
    author_email="kunneng.hung@gmail.com",
    description="Algorithms for Path Planning",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/Kun-Neng/hpp/tree/main/python",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent"
    ],
    python_requires=">=3.6"
)
