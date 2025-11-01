import os, sys
from setuptools import setup, find_packages

def read_requirements():
    with open('requirements.txt') as f:
        return [line.strip() for line in f if line.strip() and not line.startswith('#')]
 
setup(
    name='genai_lib',
    version='2.1.0',
    author='Ralf Bendig',
    author_email='deine_email@example.com',
    description='Leichtgewichtige Bibliothek für den Kurs GenAI mit LangChain 1.0+ Support.',
    long_description=open('README.md').read(),
    long_description_content_type='text/markdown',
    url='https://github.com/ralf-42/GenAI',
    packages=find_packages(where="."),
    install_requires=read_requirements(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Intended Audience :: Education",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.11",
)