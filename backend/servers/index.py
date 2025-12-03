import json
import os
import psycopg2
from typing import Dict, Any

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute("""
                SELECT id, name, ip, description, players, max_players, version, is_online, added_at, motd, icon_url
                FROM minecraft_servers
                ORDER BY added_at DESC
            """)
            
            rows = cur.fetchall()
            servers = []
            for row in rows:
                servers.append({
                    'id': row[0],
                    'name': row[1],
                    'ip': row[2],
                    'description': row[3],
                    'players': row[4],
                    'maxPlayers': row[5],
                    'version': row[6],
                    'isOnline': row[7],
                    'addedAt': row[8].isoformat() if row[8] else None,
                    'motd': row[9],
                    'iconUrl': row[10]
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'servers': servers}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            name = body.get('name')
            ip = body.get('ip')
            description = body.get('description', '')
            version = body.get('version', '1.20')
            
            cur.execute("""
                INSERT INTO minecraft_servers (name, ip, description, version, players, max_players)
                VALUES (%s, %s, %s, %s, 0, 100)
                ON CONFLICT (ip) DO UPDATE 
                SET name = EXCLUDED.name, 
                    description = EXCLUDED.description,
                    version = EXCLUDED.version
                RETURNING id, name, ip, description, players, max_players, version, is_online, added_at, motd, icon_url
            """, (name, ip, description, version))
            
            row = cur.fetchone()
            conn.commit()
            
            server = {
                'id': row[0],
                'name': row[1],
                'ip': row[2],
                'description': row[3],
                'players': row[4],
                'maxPlayers': row[5],
                'version': row[6],
                'isOnline': row[7],
                'addedAt': row[8].isoformat() if row[8] else None,
                'motd': row[9],
                'iconUrl': row[10]
            }
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'server': server}),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {})
            server_id = params.get('id')
            
            if not server_id:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing id parameter'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("DELETE FROM minecraft_servers WHERE id = %s", (server_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()