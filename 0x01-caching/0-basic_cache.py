#!/usr/bin/env python3
"""BasicCaching module"""
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """ A caching system that inherits from BaseCaching
    """
    def put(self, key, item):
        """ Add an item in the cache
        """
        if key and item:
            self.cache_data[key] = item
        else:
            pass

    def get(self, key):
        """ Get an item by key
        """
        if key is None or key not in self.cache_data:
            return None
        return self.cache_data.get(key)
