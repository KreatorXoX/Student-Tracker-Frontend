## student-tracker app
## https://student-tracker-v2.vercel.app/ ##

Project Description

Student Tracker is a web app that allows you to track your children when they are in
the school bus on their way to school or back to home.

How It Is Structured

The app consists of 3 user types (Admins, Employees and Parents)
User Types
Firstly, the admins, who are responsible for creating, updating and deleting the bus,
employee, parent and student data models. Secondly, the employees, who are
responsible for managing the bus session and checking all the student’s status of
absence/presence. Thirdly, the parents, who are responsible for informing their
child/children’s status of coming or not coming for the next day (By default all
students are marked as coming unless the parent toggled the switch to not coming,
when not coming is toggled it is permanent, parent needs to toggle it back to coming
when the child will be coming the next day).

How to Organize the Application Logically

Since everything is connected to each other, following the given steps will make
using this application easy. First thing an admin needs to do is to create a bus,
because no bus means you cannot create employees and students since their
creation requires admin to specify bus id/school name to them. After creating the
bus/buses, admin can create employees and assigned them with the specific bus.
For the creation of students, we need parent to exist beforehand, so after completing
creating buses and employees, we can start creating parents. After we created
parents. We can navigate to the parent’s details page and using the add child button
we can start creating child for the given parent and assign the child to a bus.
Now that we have everything we need in our application, we can start using it.

How It Works

The application depends on the employee to start the bus session. If the session is
not active then the only thing users can do is the crud operations on their profiles.
When the session is activated by the employee, the students whose isComing
property marked as true and assigned bus id is the same as the employee’s, will
appear as a list for the employee, and the parents of those students will be able see
their child’s location on the map when the child is marked as present by the
employee. When the child leaves the bus, the employee needs to mark that child as
absent so when the parent wants to see their child’s location instead of `view on the
map` button they will be seeing a message saying student got off the bus.

Technologies Used

React.js and 3 rd party libraries are used for frontend.
3 rd party libraries: fortawesome used for the icons that are used in the application,
react-router-dom@5 used for the navigating in the application and react-transition-
group used for animation effects (such as side drawer opening and closing).

Node.js, Express.js, MongoDB, AWS S3 and 3 rd party libraries are used
for the backend.
3 rd party libraries: mongoose used for defining data models using Schema interface
and managing the mongodb database, express-validator used as a middleware to
check whether the data passed to the routes meets our specified criteria,
jsonwebtoken used for authorization and authentication of the user, bcryptjs used for
hashing the users’ passwords as a security measure, multer used as a middleware to
handle image uploads because multer can process the binary files, sharp used for
resizing the uploaded images so that there is only one format for all the images, uuid
used for creating unique names for the uploaded images because when using AWS
S3, if you upload an image with a name that already exists in S3 bucket, S3 bucket
will override the existing image.

*S3 Bucket was required because when the server deployed to Heroku with free tier
membership, server shuts itself down after some time which results in losing the images that are
uploaded to the server using fs and having no user images was not appealing to the eye so after
some research I found that the S3 bucket was a good option for me.
