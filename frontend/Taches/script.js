document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.btn button'); 
    const sections = document.querySelectorAll('.section-content'); 
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');

    // Calendar and display sections settings

    let calendar; 

    function afficherSection(event) {
        sections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });

        const sectionId = event.currentTarget.getAttribute('data-section');
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
            section.style.display = 'block';

            if (sectionId === 'time-section') {
                const calendarEl = document.getElementById('calendar');

                if (!calendar) {  
                    calendar = new FullCalendar.Calendar(calendarEl, {
                        initialView: 'dayGridMonth',
                        height: 'auto',
                        events: async function(fetchInfo, successCallback, failureCallback) {
                            try {
                                const response = await fetch('/api/get-task');
                                const data = await response.json();

                                if (response.ok) {
                                    const events = data.tasks.map(task => ({
                                        title: task.taskId,
                                        name: task.task_name,
                                        start: task.created_at,
                                        end: task.expiration_date,
                                        description: task.task_content
                                    }));
                                    successCallback(events);
                                } else {
                                    failureCallback(data.message);
                                }
                            } catch (error) {
                                console.error('Erreur lors de la récupération des tâches :', error);
                                failureCallback('Erreur lors de la récupération des tâches');
                            }
                        }
                    });
                    calendar.render();
                } else {
                    calendar.render();
                }
            }
        }
    }
    buttons.forEach(btn => btn.addEventListener('click', afficherSection));

    // tasks settings 

    document.getElementById('submit-post').addEventListener('click', function() {
        const textarea = document.querySelector('.add-taches');
        const postContent = textarea.value;
        const taskName = document.getElementById('task-name-input').value; 
    
        if (taskName.trim() === '' || postContent.trim() === '') {
            alert("Veuillez entrer un nom et un contenu.");
            return;
        }
    
        fetch('/api/add-task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                task_name: taskName,  
                task_content: postContent 
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Erreur réseau');
            return response.json();
        })
        .then(data => {
            console.log('Succès:', data);
            const postList = document.getElementById('post-list');
            const newPost = document.createElement('li');
            newPost.textContent = `Tâche: ${data.taskName}`; 
            postList.appendChild(newPost);
            textarea.value = '';
            document.getElementById('task-name-input').value = ''; 
            if (calendar) {
                calendar.refetchEvents();
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    });
    
     document.querySelectorAll('.delete-task').forEach(button => {
        button.addEventListener('click', function() {
            const taskId = this.getAttribute('data-id');
            fetch(`/api/delete-task/${taskId}`, {
                method: 'DELETE'
            }).then(response => {
                if (response.ok) {
                    this.closest('li').remove();
                } else {
                    console.error('Erreur lors de la suppression de la tâche.');
                }
            }).catch(error => {
                console.error('Erreur réseau:', error);
            });
        });
    });

    document.querySelectorAll('.edit-task').forEach(button => {
        button.addEventListener('click', function() {
            const taskId = this.getAttribute('data-id');
            const newContent = prompt('Entrez le nouveau contenu de la tâche :');
            
            if (newContent) {
                fetch(`/api/update-task/${taskId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ task_content: newContent })
                }).then(response => {
                    if (response.ok) {
                        alert('Tâche mise à jour avec succès.');
                    } else {
                        console.error('Erreur lors de la mise à jour de la tâche.');
                    }
                }).catch(error => {
                    console.error('Erreur réseau:', error);
                });
            }
        });
    });

    // Tchat settings

socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight); 
});
 

const user = { id: user.id, name: users.username};

form.addEventListener('submit', (e) => {
    e.preventDefault(); 
    if (input.value) {
        const messageData = {
            messages_name: user.name, 
            messages_content: input.value,
            sender_id: user.id 
        };

        console.log('Envoi du message:', messageData);

        // Requête fecth pour le backend
        fetch('/api/add-message', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messageData)
        })
        .then(response => {
            if (!response.ok) throw new Error('Erreur lors de l\'envoi du message');
            return response.json();
        })
        .then(data => {
            console.log('Message stocké avec succès:', data);
            input.value = ''; 
        })
        .catch(error => {
            console.error('Erreur lors de l\'envoi du message:', error);
        });
    }
});
});  
