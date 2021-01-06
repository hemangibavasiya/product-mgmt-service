const dbCon = require('../constants/dbCon')
const { getDataWithAggregate } = require('../repository/commonRepo')

const displayAvgBillDetails = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = await generateQuery()
            const finalData = await getDataWithAggregate(query, dbCon.COLLECTION_USER)
            return resolve(finalData)
        } 
        catch (error) {
            return reject(error)
        }
    })
}

function generateQuery() {
    const query = []
    const project = {
        'userId': true,
        'name': true,
        '_id': false
    }
    const projection = generateProjection(project)
    query.push(projection)
    const join = {
        '$lookup': {
          'from': 'order', 
          'let': {
            'id': '$userId'
          }, 
          'pipeline': [
            {
              '$match': {
                '$expr': {
                  '$eq': [
                    '$userId', '$$id'
                  ]
                }
              }
            }
          ], 
          'as': 'orderData'
        }
      }
    query.push(join)
    const unwind =  {
        '$unwind': {
          'path': '$orderData'
        }
      }
    query.push(unwind)
    const group = {
        '$group': {
          '_id': {
            'userId': '$userId', 
            'name': '$name'
          }, 
          'totalData': {
            '$sum': 1
          }, 
          'avgbill': {
            '$avg': '$orderData.subtotal'
          }
        }
      }
    query.push(group)
    const finalpro = {
        'User Id': '$_id.userId', 
        'Name': '$_id.name', 
        'No Of Orders': '$totalData', 
        'Avg Bill Value': '$avgbill', 
        '_id': false
      }
    const finalProjection = generateProjection(finalpro)
    query.push(finalProjection)

    const sort = {
        '$sort': {
          'User Id': 1
        }
      }
    query.push(sort)

      return query
}

function generateProjection(project) {
    const tempProjection = {}
    tempProjection['$project'] = project
    return tempProjection
}
module.exports = {
    displayAvgBillDetails
}