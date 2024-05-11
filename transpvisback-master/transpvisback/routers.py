class URLBasedRouter:
    def __init__(self, request=None):
        self.request = request

    def db_for_read(self, model, **hints):
        if self.request:
            path = self.request.resolver_match.url_name
            sqlite3_urls = [
                '/api/v2/'
            ]
            if path in sqlite3_urls:
                return 'sqlite3'
        return 'default'
        

    def db_for_write(self, model, **hints):
        if self.request:
            path = self.request.resolver_match.url_name
            sqlite3_urls = [
                '/api/v2/'
            ]
            if path in sqlite3_urls:
                return 'sqlite3'
        return 'default'
    
    def allow_migrate(self, db, app_label, model_name=None, **hints):
        # Allow migrations for models that belong to the selected database
        return True
