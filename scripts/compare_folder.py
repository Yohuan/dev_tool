# -*- coding: utf-8 -*-
"""Diff two folders recursively.
"""

import argparse
import os
import sys

sys.path.insert(
    0,
    os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))),
                 'pysrc'))

from folder_comparing import utils


def _create_arg_parser():
    parser = argparse.ArgumentParser()
    parser.add_argument('--folder1',
                        help='the path of first folder',
                        required=True)
    parser.add_argument('--folder2',
                        help='the path of second folder',
                        required=True)
    return parser


def main():
    arg_parser = _create_arg_parser()
    args = arg_parser.parse_args()

    utils.compare_two_folders(args.folder1, args.folder2)


if __name__ == '__main__':
    main()
