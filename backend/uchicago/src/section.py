class Section(object):
    def __init__(self, id, course=None, name=None, units=None,
                 enrollment=None):
        self.id = id
        self.course = course
        self.notes = []
        self.prerequisites = None
        self.name = name
        self.units = units
        self.enrollment = enrollment
        self.crosslists = set()
        self.primaries = []
        self.secondaries = []

    def __str__(self):
        return '%s %s %s %s' % (self.course.id, self.id, self.primaries,
                                self.secondaries)

    def __repr__(self):
        return '<%s>' % str(self)
