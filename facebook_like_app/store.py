class Post:
    def __init__(self, id, photo_url, name, body):
        self.id = id
        self.photo_url = photo_url
        self.name = name
        self.body = body

posts = []

class PostStore:
    def get_all(self):
        # get all posts
        return posts

    def add(self, post):
        # append post
        posts.append(post)

    def get_by_id(self, id):
        # search for post by id
        result = None

        for post in posts:
            if post.id == id:
                result = post
                break

        return result

    def update(self, id, fields):
       # update post data
       instance = self.get_by_id(id)

       instance.photo_url = fields['photo_url']
       instance.name = fields['name']
       instance.body = fields['body']

       #for attr, value in fields.items():
       #    setattr(instance, attr, value)

    def delete(self, id):
        # delete post by id
        instance = self.get_by_id(id)
        posts.remove(instance)