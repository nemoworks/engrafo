# udo-engrafo-demo

## entity
- user
    - manager
        - username
        - password
    - saler
    - engineer

- outgoing
    - id
    - timestamp
    - manager
    - saler
    - engineer
    - task
    - feedback

- process
    - users[user]
    - nodes
        - node{start,end,node}
            - task
                - status[(action, action*){wait, finished}]
                - [(action,action*)]
                    - auth
                    - description
                    - rewardToken
            - forward:
                - requiredToken
            - backward(node): 
                - strategy{0,1,2}
                - requiredToken
                - target(1)
                - targets(2)
                - vote(2)
                    - auth
## process(a one-direction chain)
- users

- nodes
    - start
        - action:
            - auth: manager 
            - description: assign a saler
            - rewardToken: 1
        - forward:
            - requiredToken: 1
    - assignment1
        - action:
            - auth: saler
            - description: saler describe the task, send message to all engineer
            - rewardToken: 1
        - forward:
            - requiredToken: 1
        - backward:
            - strategy: 0
            - requiredToken: 0
            - target: null
    - assignment3
        - action:
            - auth: engineer(any)
            - description: engineer who first accept the task get the access to the process
            - rewardToken: 1
        - forward:
            - requiredToken: 1
        - backward:
            - strategy: 0
            - requiredToken: 0
            - target: null
    - service
        - action: 
            - auth: engineer
            - description: provide service, fill the feedback
            - rewardToken: 1
        - forward:
            - requiredToken: 1
        - backward:
            - strategy: 0
            - requiredToken: 0
            - target: null
    - approval
        - action*:
            - auth: manager
            - description: manager approve the process, yes/no
            - rewardToken: 1/0
        - action*:
            - auth: saler
            - description: saler approve the process, yes/no
            - rewardToken: 1/0
        - forward:
            - requiredToken: 2
        - backward:
            - strategy: 1
            - requiredToken: 0
            - target: service
    - end

### action-hooks
- pre-hook:
    - message all authed user the task

- post-hook:
    - adjusting auth of process
    - adjusting Token
    - mark action as finished

### forward-hooks
- pre-hook: check if all node actions finished
    - true: check if current token satiesfy the propagation constraints
        - true: propagate to next
        - false: check if satiesfy the backward constraints
            - true: target decision
            - false: restart source actions
    - false: wait for timeout

- post-hook: consume tokens
