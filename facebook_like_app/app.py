from flask import Flask, render_template, request, redirect, url_for
from store import Post, PostStore

class ReverseProxied():
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        script_name = environ.get('HTTP_X_SCRIPT_NAME2', '')
        if script_name:
            environ['SCRIPT_NAME'] = script_name
            path_info = environ['PATH_INFO']
            if path_info.startswith(script_name):
                environ['PATH_INFO'] = path_info[len(script_name):]

        scheme = environ.get('HTTP_X_SCHEME', '')
        if scheme:
            environ['wsgi.url_scheme'] = scheme
        return self.app(environ, start_response)


app = Flask(__name__)
app.wsgi_app = ReverseProxied(app.wsgi_app)

dummy_posts = [
    Post(id=1,
         photo_url='https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=50&w=50', 
         name='Sara', 
         body='Lorem Ipsum'),
    Post(id=2,
         photo_url='https://images.pexels.com/photos/736716/pexels-photo-736716.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=100&w=100', 
         name='John', 
         body='Lorem Ipsum'),
]
app.current_id = 3

post_store = PostStore()
post_store.add(dummy_posts[0])
post_store.add(dummy_posts[1])


@app.route('/')
@app.route('/index')
def home():
    return render_template('index.html', posts=post_store.get_all())


@app.route('/posts/add', methods = ['GET', 'POST'])
def post_add():
    if request.method == 'POST':
        new_post = Post(id=app.current_id,
                        photo_url=request.form['photo_url'], 
                        name=request.form['name'], 
                        body=request.form['body'])
        post_store.add(new_post)
        app.current_id += 1

        return redirect(url_for('home'))

    else:
        return render_template('post-add.html')


@app.route('/posts/delete/<int:id>')
def post_delete(id):
    post_store.delete(id)
    return redirect(url_for('home'))


@app.route('/posts/update/<int:id>', methods = ['GET', 'POST'])
def post_update(id):
    if request.method == 'POST':
        update_fields = {
            'photo_url': request.form['photo_url'], 
            'name': request.form['name'], 
            'body': request.form['body']
        }
        post_store.update(id, update_fields)

        return redirect(url_for('home'))

    else:
        post = post_store.get_by_id(id)
        return render_template('post-update.html', post=post)