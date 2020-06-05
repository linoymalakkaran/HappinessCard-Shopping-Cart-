let ctxpath = '';
let service_url_prefix = '';


/// #if build
ctxpath = '/test_happinesscard';
/// #else
service_url_prefix = 'http://localhost:3000'
/// #endif

export { ctxpath, service_url_prefix };
