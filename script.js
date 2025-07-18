// Daily Planner JavaScript
        class DailyPlanner {
          constructor() {
            this.currentPage = 'page1';
            this.plannerData = {
              date: this.getCurrentDate(),
              waterGlasses: new Array(8).fill(false),
              inspiringWord: '',
              priorities: ['', '', ''],
              tasks: Array.from({ length: 10 }, (_, i) => ({
                id: `task-${i}`,
                text: '',
                completed: false,
                category: null
              })),
              notes: '',
              meals: {
                breakfast: ['', '', ''],
                lunch: ['', '', ''],
                dinner: ['', '', ''],
                snacks: ['', '']
              },
              mood: null,
              wins: ''
            };
            
            this.init();
          }

          init() {
            this.setupEventListeners();
            this.generateWaterGlasses();
            this.generateTasks();
            this.updateDateDisplay();
            this.loadFromLocalStorage();
            this.setupAutoSave();
          }

          getCurrentDate() {
            return new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
          }

          setupEventListeners() {
            // Navigation
            document.getElementById('page1-btn').addEventListener('click', () => this.switchPage('page1'));
            document.getElementById('page2-btn').addEventListener('click', () => this.switchPage('page2'));
            document.getElementById('duplicate-btn').addEventListener('click', () => this.duplicateForTomorrow());

            // Page 1 inputs
            document.getElementById('inspiring-word').addEventListener('input', (e) => {
              this.plannerData.inspiringWord = e.target.value;
              this.saveToLocalStorage();
            });

            // Priority inputs
            document.querySelectorAll('.priority-input').forEach(input => {
              input.addEventListener('input', (e) => {
                const index = parseInt(e.target.dataset.priority);
                this.plannerData.priorities[index] = e.target.value;
                this.saveToLocalStorage();
              });
            });

            // Copy tasks button
            document.getElementById('copy-tasks-btn').addEventListener('click', () => this.copyTasks());

            // Page 2 inputs
            document.getElementById('notes-textarea').addEventListener('input', (e) => {
              this.plannerData.notes = e.target.value;
              this.saveToLocalStorage();
            });

            document.getElementById('wins-textarea').addEventListener('input', (e) => {
              this.plannerData.wins = e.target.value;
              this.saveToLocalStorage();
            });

            // Meal inputs
            document.querySelectorAll('.meal-input').forEach(input => {
              input.addEventListener('input', (e) => {
                const mealType = e.target.dataset.meal;
                const index = parseInt(e.target.dataset.index);
                this.plannerData.meals[mealType][index] = e.target.value;
                this.saveToLocalStorage();
              });
            });

            // Mood buttons
            document.querySelectorAll('.mood-button').forEach(button => {
              button.addEventListener('click', (e) => {
                const mood = parseInt(e.currentTarget.dataset.mood);
                this.selectMood(mood);
              });
            });

            // NEW: Download summary button
            document.getElementById('download-summary-btn').addEventListener('click', () => this.downloadSummary());
          }

          switchPage(page) {
            this.currentPage = page;
            
            // Update navigation buttons
            document.querySelectorAll('.nav-button').forEach(btn => {
              btn.classList.remove('nav-button-active');
            });
            
            if (page === 'page1') {
              document.getElementById('page1-btn').classList.add('nav-button-active');
              document.getElementById('page1').classList.remove('page-hidden');
              document.getElementById('page2').classList.add('page-hidden');
            } else {
              document.getElementById('page2-btn').classList.add('nav-button-active');
              document.getElementById('page1').classList.add('page-hidden');
              document.getElementById('page2').classList.remove('page-hidden');
            }
          }

          generateWaterGlasses() {
            const container = document.getElementById('water-glasses');
            container.innerHTML = '';
            
            for (let i = 0; i < 8; i++) {
              const glassButton = document.createElement('button');
              glassButton.className = `water-glass ${this.plannerData.waterGlasses[i] ? 'filled' : 'empty'}`;
              glassButton.innerHTML = this.createWaterGlassSVG(this.plannerData.waterGlasses[i]);
              glassButton.addEventListener('click', () => this.toggleWaterGlass(i));
              container.appendChild(glassButton);
            }
          }

          createWaterGlassSVG(filled) {
            return `
              <svg width="32" height="40" viewBox="0 0 32 40">
                <path
                  d="M6 8 L26 8 L24 36 L8 36 Z"
                  fill="${filled ? '#4FC3F7' : 'white'}"
                  stroke="#333"
                  stroke-width="2"
                />
                ${filled ? `
                  <path
                    d="M7 10 L25 10 L23.5 34 L8.5 34 Z"
                    fill="#2196F3"
                  />
                ` : ''}
                <ellipse
                  cx="16"
                  cy="8"
                  rx="10"
                  ry="2"
                  fill="none"
                  stroke="#333"
                  stroke-width="2"
                />
              </svg>
            `;
          }

          toggleWaterGlass(index) {
            this.plannerData.waterGlasses[index] = !this.plannerData.waterGlasses[index];
            this.generateWaterGlasses();
            this.saveToLocalStorage();
          }

          generateTasks() {
            const container = document.getElementById('tasks-list');
            container.innerHTML = '';
            
            this.plannerData.tasks.forEach((task, index) => {
              const taskElement = document.createElement('div');
              taskElement.className = 'task-item';
              taskElement.innerHTML = `
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-task="${index}"></div>
                <input 
                  type="text" 
                  class="task-input figma-hand-regular" 
                  placeholder="Task ${index + 1}..." 
                  value="${task.text}"
                  data-task="${index}"
                />
                <div class="task-categories">
                  <button class="category-button work ${task.category === 'work' ? 'active' : ''}" data-task="${index}" data-category="work">
                    Work
                  </button>
                  <button class="category-button personal ${task.category === 'personal' ? 'active' : ''}" data-task="${index}" data-category="personal">
                    Personal
                  </button>
                </div>
              `;
              
              // Add event listeners for this task
              const checkbox = taskElement.querySelector('.task-checkbox');
              const input = taskElement.querySelector('.task-input');
              const workBtn = taskElement.querySelector('.category-button.work');
              const personalBtn = taskElement.querySelector('.category-button.personal');
              
              checkbox.addEventListener('click', () => this.toggleTaskCompletion(index));
              input.addEventListener('input', (e) => this.updateTaskText(index, e.target.value));
              workBtn.addEventListener('click', () => this.toggleTaskCategory(index, 'work'));
              personalBtn.addEventListener('click', () => this.toggleTaskCategory(index, 'personal'));
              
              container.appendChild(taskElement);
            });
          }

          toggleTaskCompletion(index) {
            this.plannerData.tasks[index].completed = !this.plannerData.tasks[index].completed;
            this.generateTasks();
            this.saveToLocalStorage();
          }

          updateTaskText(index, text) {
            this.plannerData.tasks[index].text = text;
            this.saveToLocalStorage();
          }

          toggleTaskCategory(index, category) {
            const currentCategory = this.plannerData.tasks[index].category;
            this.plannerData.tasks[index].category = currentCategory === category ? null : category;
            this.generateTasks();
            this.saveToLocalStorage();
          }

          selectMood(mood) {
            this.plannerData.mood = this.plannerData.mood === mood ? null : mood;
            
            // Update mood button appearance
            document.querySelectorAll('.mood-button').forEach(button => {
              button.classList.remove('selected');
            });
            
            if (this.plannerData.mood !== null) {
              document.querySelector(`[data-mood="${this.plannerData.mood}"]`).classList.add('selected');
            }
            
            this.saveToLocalStorage();
          }

          copyTasks() {
            const tasksText = this.plannerData.tasks
              .filter(task => task.text.trim())
              .map(task => `${task.completed ? '✓' : '○'} ${task.text} ${task.category ? `[${task.category}]` : ''}`)
              .join('\n');
            
            if (navigator.clipboard) {
              navigator.clipboard.writeText(tasksText).then(() => {
                this.showToast('Tasks copied to clipboard!');
              }).catch(() => {
                this.fallbackCopyToClipboard(tasksText);
              });
            } else {
              this.fallbackCopyToClipboard(tasksText);
            }
          }

          fallbackCopyToClipboard(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('Tasks copied to clipboard!');
          }

          showToast(message) {
            // Simple toast implementation
            const toast = document.createElement('div');
            toast.textContent = message;
            toast.style.cssText = `
              position: fixed;
              top: 20px;
              right: 20px;
              background: #10b981;
              color: white;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: 500;
              z-index: 1000;
              animation: slideInRight 0.3s ease-out;
            `;
            
            // Add animation keyframes if not already added
            if (!document.querySelector('#toast-styles')) {
              const style = document.createElement('style');
              style.id = 'toast-styles';
              style.textContent = `
                @keyframes slideInRight {
                  from { transform: translateX(100%); opacity: 0; }
                  to { transform: translateX(0); opacity: 1; }
                }
              `;
              document.head.appendChild(style);
            }
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
              toast.remove();
            }, 3000);
          }

          // NEW: Download Summary Function
          downloadSummary() {
            // Get fresh data from localStorage
            const savedData = JSON.parse(localStorage.getItem('dailyPlannerData')) || this.plannerData;
            
            // Build human-readable summary
            const summary = this.buildSummaryText(savedData);
            
            // Create filename with date
            const dateForFilename = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
            const filename = `CaroList_Summary_${dateForFilename}.txt`;
            
            // Create and download file
            const blob = new Blob([summary], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showToast('Summary downloaded successfully!');
          }

          buildSummaryText(data) {
            let summary = '';
            
            // Header
            summary += `CaroList Daily Summary\n`;
            summary += `========================\n\n`;
            
            // Date
            summary += `Date: ${data.date}\n\n`;
            
            // Inspiring Word
            if (data.inspiringWord) {
              summary += `Today's Inspiring Word: "${data.inspiringWord}"\n\n`;
            }
            
            // Water Intake
            const waterCount = data.waterGlasses.filter(glass => glass).length;
            summary += `Water Intake: ${waterCount} out of 8 glasses completed\n\n`;
            
            // Priorities
            summary += `Top 3 Priorities:\n`;
            data.priorities.forEach((priority, index) => {
              if (priority.trim()) {
                summary += `  ${index + 1}. ${priority}\n`;
              }
            });
            summary += `\n`;
            
            // Tasks
            const activeTasks = data.tasks.filter(task => task.text.trim());
            if (activeTasks.length > 0) {
              summary += `Today's Tasks:\n`;
              activeTasks.forEach(task => {
                const status = task.completed ? '✓ Completed' : '○ Pending';
                const category = task.category ? ` [${task.category}]` : '';
                summary += `  ${status}: ${task.text}${category}\n`;
              });
              summary += `\n`;
            }
            
            // Notes
            if (data.notes.trim()) {
              summary += `Notes & Upcoming:\n`;
              summary += `${data.notes}\n\n`;
            }
            
            // Meals
            summary += `Meals & Snacks:\n`;
            ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(mealType => {
              const mealItems = data.meals[mealType].filter(item => item.trim());
              if (mealItems.length > 0) {
                summary += `  ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}:\n`;
                mealItems.forEach(item => {
                  summary += `    • ${item}\n`;
                });
              }
            });
            summary += `\n`;
            
            // Mood
            if (data.mood !== null) {
              const moodLabels = {
                1: 'Very Sad 😢',
                2: 'Sad 😕',
                3: 'Neutral 😐',
                4: 'Happy 😊',
                5: 'Very Happy 😄'
              };
              summary += `Mood: ${moodLabels[data.mood]}\n\n`;
            }
            
            // Wins
            if (data.wins.trim()) {
              summary += `Day's Wins:\n`;
              summary += `${data.wins}\n\n`;
            }
            
            // Footer
            summary += `\n========================\n`;
            summary += `Generated by CaroList Daily Planner\n`;
            summary += `Export Date: ${new Date().toLocaleString()}\n`;
            
            return summary;
          }

          duplicateForTomorrow() {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            this.plannerData = {
              ...this.plannerData,
              date: tomorrow.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }),
              waterGlasses: new Array(8).fill(false),
              inspiringWord: '',
              priorities: ['', '', ''],
              tasks: this.plannerData.tasks.map(task => ({
                ...task,
                text: '',
                completed: false,
                category: null
              })),
              notes: '',
              meals: {
                breakfast: ['', '', ''],
                lunch: ['', '', ''],
                dinner: ['', '', ''],
                snacks: ['', '']
              },
              mood: null,
              wins: ''
            };
            
            this.switchPage('page1');
            this.updateAllDisplays();
            this.saveToLocalStorage();
            this.showToast('Planner duplicated for tomorrow!');
          }

          updateDateDisplay() {
            document.getElementById('current-date').textContent = this.plannerData.date;
          }

          updateAllDisplays() {
            this.updateDateDisplay();
            this.generateWaterGlasses();
            this.generateTasks();
            
            // Update form inputs
            document.getElementById('inspiring-word').value = this.plannerData.inspiringWord;
            document.getElementById('notes-textarea').value = this.plannerData.notes;
            document.getElementById('wins-textarea').value = this.plannerData.wins;
            
            // Update priorities
            document.querySelectorAll('.priority-input').forEach((input, index) => {
              input.value = this.plannerData.priorities[index];
            });
            
            // Update meals
            document.querySelectorAll('.meal-input').forEach(input => {
              const mealType = input.dataset.meal;
              const index = parseInt(input.dataset.index);
              input.value = this.plannerData.meals[mealType][index];
            });
            
            // Update mood selection
            document.querySelectorAll('.mood-button').forEach(button => {
              button.classList.remove('selected');
            });
            if (this.plannerData.mood !== null) {
              document.querySelector(`[data-mood="${this.plannerData.mood}"]`).classList.add('selected');
            }
          }

          saveToLocalStorage() {
            // Using in-memory storage instead of localStorage for artifact compatibility
            this.storedData = JSON.stringify(this.plannerData);
          }

          loadFromLocalStorage() {
            // Using in-memory storage instead of localStorage for artifact compatibility
            if (this.storedData) {
              try {
                const savedData = JSON.parse(this.storedData);
                // Only load if it's from today
                if (savedData.date === this.getCurrentDate()) {
                  this.plannerData = savedData;
                  this.updateAllDisplays();
                }
              } catch (e) {
                console.error('Error loading saved data:', e);
              }
            }
          }

          setupAutoSave() {
            // Auto-save every 30 seconds
            setInterval(() => {
              this.saveToLocalStorage();
            }, 30000);
          }
        }

        // Initialize the planner when the page loads
        document.addEventListener('DOMContentLoaded', () => {
          new DailyPlanner();
        });